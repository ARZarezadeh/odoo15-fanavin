{
    "name": "Hospital Management",
    "author": "arzarezadeh",
    "website": "http://www.arzarezadeh.com",
    "category": "Health",
    "version": "1.0",
    "license": "LGPL-3",
    "installable": True,
    "auto_install": False,
    "application": True,
    "depends": ["mail", "base"],
    "data": [
        "security/ir.model.access.csv",
        "views/menu.xml",
        "views/patient.xml",
        "views/prescription.xml",
    ],
    "sequence": -100,
}
