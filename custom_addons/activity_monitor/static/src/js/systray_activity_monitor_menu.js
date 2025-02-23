/** @odoo-module **/

import {qweb as QWeb} from 'web.core';
import Widget from 'web.Widget';
import systrayMenu from 'web.SystrayMenu';
import session from 'web.session';


let ActivityMonitorMenu = Widget.extend({
    name: 'activity_monitor_menu',
    template: 'activity_monitor.systray.ActivityMonitorMenu',
    events: {
        'click .o_activity_monitor_activity_monitor_action': '_onActivityMonitorActionClick',
        'click .o_last_changes_preview': '_onLastChangesRecordClick',
        'show.bs.dropdown': '_onActivityMonitorMenuShow',
        'hide.bs.dropdown': '_onActivityMonitorMenuHide',
        'click .o_show_more_changes': '_onShowMoreChanges',
        'click .o_show_less_changes': '_onShowLessChanges',
    },
    start: function () {
        this._$activityMonitorPreview = this.$('.o_activity_monitor_systray_dropdown_items');
        this._updateActivityMonitorPreview();
        this._showAllChanges = false;
        return this._super();
    },

    /**
     * Fetch activity data via RPC.
     * @private
     */
    _getActivityData: function () {
        let self = this;

        return self._rpc({
            model: 'res.users',
            method: 'get_user_recent_changes',
            args: [],
            kwargs: {context: session.user_context},
        }).then(function (data) {
            self._allChanges = data.sort((a, b) => new Date(b.write_date) - new Date(a.write_date))
            self._changes = !self._showAllChanges ? self._allChanges.slice(0, 10) : self._allChanges
            self._changeCounter = data.length
            self.$('.o_last_changes_counter').text(self._changeCounter);
        });
    },

    /**
     * Update the systray dropdown with the latest activity data.
     * @private
     */
    _updateActivityMonitorPreview: function () {
        let self = this;
        self._getActivityData().then(function () {
            self._$activityMonitorPreview.html(QWeb.render('activity_monitor.systray.ActivityMonitorMenu.Previews', {
                widget: self,
            }));
        });
    },

    /**
     * Trigger data update on menu show.
     * @private
     */
    _onActivityMonitorMenuShow: function () {
        document.body.classList.add('modal-open');
        this._updateActivityMonitorPreview();
    },

    /**
     * Remove modal class on menu hide.
     * @private
     */
    _onActivityMonitorMenuHide: function () {
        document.body.classList.remove('modal-open');
    },

    /**
     * @private
     * @param {MouseEvent} ev
     */
    _onActivityMonitorActionClick: (ev) => {
        console.log("inside open url on click function")
        ev.stopPropagation();
        this.$('.dropdown-toggle').dropdown('toggle');
        let targetAction = $(ev.currentTarget);
        let actionXmlid = targetAction.data('action_xmlid');
        if (actionXmlid) {
            this.do_action(actionXmlid);
        } else {

            this.do_action({
                type: 'ir.actions.act_window',
                name: targetAction.data('model_name'),
                views: [[false, 'activity'], [false, 'kanban'], [false, 'list'], [false, 'form']],
                view_mode: 'activity',
                res_model: targetAction.data('res_model'),
                domain: domain,
            }, {
                clear_breadcrumbs: true,
            });
        }
    },

    /**
     * Redirect to particular record form view
     * @private
     * @param {MouseEvent} event
     */
    _onLastChangesRecordClick: function (event) {
        const data = _.extend({}, $(event.currentTarget).data(), $(event.target).data());
        const resModel = data.res_model;
        const resId = data.res_id;
        const modelName = data.res_model_name || '';

        console.log(`modelName=${modelName}, resModel=${resModel}, resId=${resId}`)

        if (resModel && resId) {
            this.do_action({
                type: 'ir.actions.act_window',
                name: modelName,
                res_model: resModel,
                res_id: resId, // Specify the record ID to open a specific record.
                views: [[false, 'form']], // Open in Form view by default.
                target: 'current', // Open in the current window.
            });
        }
    },

     _onShowMoreChanges: function (ev) {
        ev.stopPropagation();
        this._showAllChanges = true;
        // this._changes = this._allChanges; // Show all changes
        //  console.log("this._changes: ", this._changes)
        this._updateActivityMonitorPreview();
    },

    _onShowLessChanges: function (ev) {
        ev.stopPropagation();
        this._showAllChanges = false;
        // this._changes = this._allChanges.slice(0, 10);  // Show only 10
        this._updateActivityMonitorPreview();
    }
});

systrayMenu.Items.push(ActivityMonitorMenu);
export default ActivityMonitorMenu;


