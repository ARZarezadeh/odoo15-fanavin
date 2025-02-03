/** @odoo-module **/

import { registerClassPatchModel, registerFieldPatchModel } from '@mail/model/model_core';
import { attr } from '@mail/model/model_field';

// Define your patch
registerFieldPatchModel('mail.attachment', 'better_loading/static/src/js/attachment.js', {
    progress: attr({ default: 0 }),
});
