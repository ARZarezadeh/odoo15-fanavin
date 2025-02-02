/** @odoo-module **/

const { Component } = owl;
import { useService } from "@web/core/utils/hooks";

export class FileUploadWithProgress extends Component {

    setup() {
        super.setup();
        this.rpc = useService("rpc");  // Use RPC service
        this.progress = 0;  // Initialize progress
        this.estimatedTime = "Calculating...";
    }

    async uploadFile(event) {
        console.log("----------------- upload file -------------------")
        const file = event.target.files[0];
        if (!file) return;

        this.progress = 0;
        this.estimatedTime = "Starting...";
        this.render();

        const formData = new FormData();
        formData.append("model", "your.model");
        formData.append("id", 1);
        formData.append("ufile", file);

        const startTime = new Date().getTime();

        // Use Fetch API to send file
        const response = await fetch("/custom/upload_attachment", {
            method: "POST",
            body: formData,
        });

        // Track upload progress manually
        const reader = response.body.getReader();
        const totalSize = file.size;
        let uploadedSize = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            uploadedSize += value.length;
            this.progress = Math.round((uploadedSize / totalSize) * 100);

            // Estimate remaining time
            const elapsedTime = (new Date().getTime() - startTime) / 1000;  // Time in seconds
            const speed = uploadedSize / elapsedTime;  // Bytes per second
            const remainingTime = (totalSize - uploadedSize) / speed;
            this.estimatedTime = `${Math.round(remainingTime)}s remaining`;

            this.render();
        }

        this.progress = 100;
        this.estimatedTime = "Upload complete!";
        this.render();
    }
}

FileUploadWithProgress.template = "better_loading.FileUploadWithProgress";



// /** @odoo-module **/
//
// import { AttachmentImage } from '@mail/components/attachment_image/attachment_image';
// import { patch } from '@web/core/utils/patch';
//
// patch(AttachmentImage.prototype, 'better_loading.attachment_progress', {
//
//     setup() {
//         this._super.apply(this, arguments);
//     },
//
//     /**
//      * Override the getter to include progress tracking
//      */
//     get attachmentImage() {
//         const attachment = this._super();
//         if (attachment) {
//             this._trackUploadProgress(attachment);
//         }
//         return attachment;
//     },
//
//     /**
//      * Custom method to track upload progress
//      */
//     _trackUploadProgress(attachment) {
//         console.log("start of track.....", attachment)
//         if (!attachment || !attachment.progressState) return;
//         // Monitor progress dynamically
//         const progressBar = document.querySelector('.custom-progress-bar');
//         if (progressBar) {
//             progressBar.value = attachment.progressState.percent;
//         }
//     }
// });
