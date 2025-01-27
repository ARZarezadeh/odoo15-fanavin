{
    'name': 'Activity Monitor',
    'author': 'ARZarezadeh',
    'category': 'Website/Website',
    'version': '1.0',
    'application': False,
    'installable': True,
    'auto_install': False,
    'license': 'LGPL-3',
    'sequence': -101,
    'depends': ['base'],
    'assets': {
        'web.assets_backend': {
            'activity_monitor/static/src/js/systray_activity_monitor_menu.js',
            'activity_monitor/static/src/scss/style.scss',

        },
        'web.assets_qweb': {
            'activity_monitor/static/src/xml/systray_activity_monitor.xml',
        },
    },

}
