{
    'name': 'Better Loading',
    'author': 'ARZarezadeh',
    'category': 'Theme',
    'version': '1.0',
    'application': False,
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
    'sequence': -102,
    'depends': ['base', 'mail'],
    'assets': {
        'web.assets_qweb': [
            'better_loading/static/src/components/*/*.xml',
        ],
        'web.assets_backend': [
            'better_loading/static/src/components/*/*.js',
            'better_loading/static/src/components/attachment_image/attachment_image.scss',
            'better_loading/static/src/models/attachment.js'

        ],
    }

}
