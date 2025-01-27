from odoo import fields, models, api


class Prescription(models.Model):
    _name = 'hospital.prescription'
    _description = 'Prescription'

    patient_id = fields.Many2one('hospital.patient', string="Patient", required=True)
    medication = fields.Char(string="Medication")
    dosage = fields.Char(string="Dosage")
    prescribed_date = fields.Date(string="Prescribed Date")