import json
import time

from odoo.exceptions import AccessError
from odoo.http import request
from odoo.tools.translate import _

from odoo import http


class DiscussController(http.Controller):

    @http.route('/mail/attachment/upload', methods=['POST'], type='http', auth='public')
    def mail_attachment_upload(self, ufile, thread_id, thread_model, is_pending=False, **kwargs):
        channel_partner = request.env['mail.channel.partner']
        if thread_model == 'mail.channel':
            channel_partner = request.env['mail.channel.partner']._get_as_sudo_from_request_or_raise(request=request,
                                                                                                     channel_id=int(
                                                                                                         thread_id))
        vals = {
            'name': ufile.filename,
            'raw': ufile.read(),
            'res_id': int(thread_id),
            'res_model': thread_model,
        }
        if is_pending and is_pending != 'false':
            # Add this point, the message related to the uploaded file does
            # not exist yet, so we use those placeholder values instead.
            vals.update({
                'res_id': 0,
                'res_model': 'mail.compose.message',
            })
        if channel_partner.env.user.share:
            # Only generate the access token if absolutely necessary (= not for internal user).
            vals['access_token'] = channel_partner.env['ir.attachment']._generate_access_token()
        try:
            attachment = channel_partner.env['ir.attachment'].create(vals)
            attachment._post_add_create()
            attachmentData = {
                'filename': ufile.filename,
                'id': attachment.id,
                'mimetype': attachment.mimetype,
                'name': attachment.name,
                'size': attachment.file_size
            }
            if attachment.access_token:
                attachmentData['accessToken'] = attachment.access_token
        except AccessError:
            attachmentData = {'error': _("You are not allowed to upload an attachment here.")}
        return request.make_response(
            data=json.dumps(attachmentData),
            headers=[('Content-Type', 'application/json')]
        )
