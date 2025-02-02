from odoo import models, fields, api
import logging
import heapq  # To manage top 10 records efficiently

_logger = logging.getLogger(__name__)


class Users(models.Model):
    """ Update res.users
        - add activity_monitor menu
    """
    _name = 'res.users'
    _inherit = ['res.users']

    @api.model
    def get_user_recent_changes(self):
        current_user_id = self.env.user.id
        user_changes = []
        all_models = ['mail.message']
        all_models2 = self.env['ir.model'].search([]).mapped('model')

        for model in all_models2:
            model_name = model
            try:
                if 'write_uid' in self.env[model_name]._fields and 'write_date' in self.env[model_name]._fields:
                    records = self.env[model_name].sudo().search(
                        [('write_uid', '=', current_user_id)],
                        order='write_date desc', limit=10
                    )
                    for record in records:
                        record_id = getattr(record, "res_id", None) or getattr(record, "id", None)
                        record_model = getattr(record, "res_model", None) or getattr(record, "model",None) or model_name
                        if record.write_date and record_id and record_model:
                            user_changes.append({
                                'model_name': record_model or model_name,
                                'model': record_model,
                                'id': record_id,
                                'write_date': record.write_date,
                            })
            except Exception as e:
                self.env.cr.rollback()
                _logger.warning(f"Skipping model {model_name}: {e}")
        # user_changes = heapq.nlargest(10, user_changes, key=lambda k: k['write_date'])
        return user_changes
