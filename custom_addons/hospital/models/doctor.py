from odoo import fields, models, api


class Doctor(models.Model):
    _name = 'hospital.doctor'
    _description = 'Hospital Doctor'

    name = fields.Char()
    dob = fields.Date()
    
