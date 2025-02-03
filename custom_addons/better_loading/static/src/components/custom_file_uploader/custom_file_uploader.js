/** @odoo-module **/

import {replace} from '@mail/model/model_field_command';
import {FileUploader} from '@mail/components/file_uploader/file_uploader';
import { patch } from '@web/core/utils/patch';


const geAttachmentNextTemporaryId = (function () {
    let tmpId = 0;
    return () => {
        tmpId -= 1;
        return tmpId;
    };
})();


patch(FileUploader.prototype, 'better_loading.custom_file_uploader', {
    async _performUpload({composer, files, thread}) {
        console.log("***************** custom file uploader ********************")
        const uploadingAttachments = new Map();
        for (const file of files) {
            uploadingAttachments.set(file, this.messaging.models['mail.attachment'].insert({
                composer: composer && replace(composer),
                filename: file.name,
                id: geAttachmentNextTemporaryId(),
                isUploading: true,
                mimetype: file.type,
                progress: 0,
                name: file.name,
                originThread: (!composer && thread) ? replace(thread) : undefined,
            }));
        }
        console.log("this is uploading attachemnts::: ", uploadingAttachments)
        for (const file of files) {
            const uploadingAttachment = uploadingAttachments.get(file);
            if (!uploadingAttachment.exists()) {
                // This happens when a pending attachment is being deleted by user before upload.
                continue;
            }
            if ((composer && !composer.exists()) || (thread && !thread.exists())) {
                return;
            }
            try {
                const formData = this._createFormData({composer, file, thread});

                // Use XMLHttpRequest to track progress
                const xhr = new XMLHttpRequest();
                xhr.open("POST", "/mail/attachment/upload", true);

                // Track progress and update the progress field
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable && uploadingAttachment.exists()) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        uploadingAttachment.update({progress: percent});
                    }
                };

                // Handle success
                xhr.onload = async () => {
                    if (xhr.status === 200 && uploadingAttachment.exists()) {
                        const attachmentData = JSON.parse(xhr.responseText);
                        uploadingAttachment.delete(); // Remove temporary record
                        if ((composer && !composer.exists()) || (thread && !thread.exists())) {
                            return;
                        }
                        this._onAttachmentUploaded({attachmentData, composer, thread});
                    }
                };

                // Handle errors
                xhr.onerror = () => {
                    console.error('Upload failed:', xhr.statusText);
                };

                // Send the request
                xhr.send(formData);
                // const response = await this.env.browser.fetch('/mail/attachment/upload', {
                //     method: 'POST',
                //     body: this._createFormData({composer, file, thread}),
                //     signal: uploadingAttachment.uploadingAbortController.signal,
                // });
                // const attachmentData = await response.json();
                // if (uploadingAttachment.exists()) {
                //     uploadingAttachment.delete();
                // }
                // if ((composer && !composer.exists()) || (thread && !thread.exists())) {
                //     return;
                // }
                // this._onAttachmentUploaded({attachmentData, composer, thread});
            } catch (e) {
                if (e.name !== 'AbortError') {
                    throw e;
                }
            }
        }
    }
})