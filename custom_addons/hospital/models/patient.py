from odoo import api, fields, models


class Patient(models.Model):
    _name = 'hospital.patient'
    _description = 'Hospital Patient'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    name = fields.Char()
    address = fields.Char(tracking=True)
    city = fields.Char()
    state = fields.Char()
    zip = fields.Char(tracking=True)
    phone = fields.Char()
    email = fields.Char()
    date_of_birth = fields.Date()
    gender = fields.Selection([('male', 'Male'), ('female', 'Female')])
    test = fields.Char

    prescription_ids = fields.One2many('hospital.prescription', 'patient_id')
