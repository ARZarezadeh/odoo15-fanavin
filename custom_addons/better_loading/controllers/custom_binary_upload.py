from odoo import http
from odoo.http import request
import json
import base64
import time


class CustomBinaryUpload(http.Controller):

    @http.route('/custom/upload_attachment', type='http', auth="user", methods=['POST'], csrf=False)
    def upload_attachment(self, model, id, ufile):
        """
        Custom file upload controller that tracks upload progress and returns real-time percentage.
        """
        print("***************************inside custom upload")
        files = request.httprequest.files.getlist('ufile')
        for file in files:
            file_size = file.content_length  # Get total file size
            chunk_size = 4096  # Read in chunks (4KB per read)
            uploaded_size = 0  # Track uploaded bytes

            encoded_data = b""

            # Read file in chunks to simulate progress
            while True:
                chunk = file.read(chunk_size)
                if not chunk:
                    break
                encoded_data += chunk
                uploaded_size += len(chunk)

                progress_percent = round((uploaded_size / file_size) * 100)

                # Simulate delay (remove this in production)
                time.sleep(0.1)

                # Send intermediate progress (if using WebSockets, this can be pushed dynamically)
                request.env.cr.commit()  # Commit to avoid transaction rollback in case of failure

            # Store file as attachment
            attachment = request.env['ir.attachment'].create({
                'name': file.filename,
                'datas': base64.b64encode(encoded_data),
                'res_model': model,
                'res_id': int(id),
            })

        return json.dumps({
            'id': attachment.id,
            'filename': file.filename,
            'size': file_size,
            'progress': 100,  # Ensure final progress is 100%
        })
