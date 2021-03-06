import {Button, Icon, Modals} from 'meteor/universe:ui-react';
import {AutorunMixin, SubscriptionMixin} from 'meteor/universe:utilities-react';
import React from 'react';
import {_i18n as i18n} from "meteor/universe:i18n";

export const AdminView = React.createClass({
    displayName: 'Admin.Users.View',

    mixins: [SubscriptionMixin, AutorunMixin],

    autorunUsersSubscription () {
        this.subscribe('universe:admin-users');
        this.setState({
            users: UniUsers.find({blocked: {$ne: true}}).fetch()
        });
    },

    render () {
        return (
            <div className="test-class">
                <table className="ui striped table">
                    <thead>
                        <tr>
                            <th>{_i18n.__('admin.users.fields.username')}</th>
                            <th>{_i18n.__('admin.users.fields.fullname')}</th>
                            <th>{_i18n.__('admin.users.fields.email')}</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.users.map(this.renderUser)}
                    </tbody>
                </table>
            </div>
        );
    },

    renderUser ({_id, emails: [{address} = {}] = [], profile: {name} = {}, username}) {
        return (
            <tr key={_id}>
                <td>{username}</td>
                <td>{name}</td>
                <td>{address}</td>
                <td>
                    <div className="right aligned">
                        <Button className="basic mini icon" onClick={this.showBlock.bind(this, _id)}>
                            <Icon icon="ban"/>
                        </Button>
                        <Button className="basic mini icon" onClick={this.showUpdate.bind(this, _id)}>
                            <Icon icon="edit"/>
                        </Button>
                        <Button className="basic mini icon" onClick={this.showPassword.bind(this, _id)}>
                            <Icon icon="lock"/>
                        </Button>
                        <Button className="basic mini icon" onClick={this.showRemove.bind(this, _id)}>
                            <Icon icon="remove"/>
                        </Button>
                    </div>
                </td>
            </tr>
        );
    },
    showBlock (id) {
        const user = UniUsers.findOne(id);

        Modals.show('ask', {
            message: i18n.__('admin.users.actions.block'),

            yesAction () {
                UniUsers.call('blockUser', id);
            }
        });
    },

    showRemove (id) {
        const user = UniUsers.findOne(id);

        Modals.show('ask', {
            message: i18n.__('admin.users.actions.remove', {name: user.getName()}),

            yesAction () {
                user.remove();
            }
        });
    },

    showPassword (id) {
        const user = UniUsers.findOne(id);

        Modals.show('ask', {
            message: i18n.__('admin.users.actions.password', {name: user.getName()}),

            yesAction () {
                user.call('universe:admin-users/resetPassword', user._id);
            }
        });
    },

    showUpdate (id) {
        Modals.show('admin.users.update', {
            user: UniUsers.findOne(id)
        });
    }
});

export default AdminView;
