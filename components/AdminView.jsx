import {Button, Icon, Modals} from 'meteor/universe:ui-react';
import {AutorunMixin, SubscriptionMixin} from 'meteor/universe:utilities-react';
import React from 'react';
import {_i18n} from 'meteor/universe:i18n';
import {UniUsers} from 'meteor/universe:collection';


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
                            <th>{_i18n.__('admin.users.fields.accountType')}</th>
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

    renderUser ({_id, emails: [{address} = {}] = [], profile: {name} = {}, username, accountType}) {
        return (
            <tr key={_id}>
                <td>{username}</td>
                <td className="center-block">{this.accountTypeIcon({accountType})}</td>
                <td>{name}</td>
                <td>{address}</td>
                <td>
                    <div className="right aligned">
                        <Button 
                            data-tooltip="Ban user"
                            className="basic mini icon tooltip tooltip-left"
                            onClick={this.showBlock.bind(this, _id)}
                        >
                            <Icon icon="ban"/>
                        </Button>
                        <Button
                            data-tooltip="Edit user"
                            className="basic mini icon tooltip tooltip-left"
                            onClick={this.showUpdate.bind(this, _id)}
                        >
                            <Icon icon="edit"/>
                        </Button>
                        <Button
                            data-tooltip="Lock user"
                            className="basic mini icon tooltip tooltip-left"
                            onClick={this.showPassword.bind(this, _id)}
                        >
                            <Icon icon="lock"/>
                        </Button>
                        <Button
                            data-tooltip="Remove user"
                            className="basic mini icon tooltip tooltip-left"
                            onClick={this.showRemove.bind(this, _id)}
                        >
                            <Icon icon="remove"/>
                        </Button>
                    </div>
                </td>
            </tr>
        );
    },
    showBlock (id) {
        Modals.show('ask', {
            message: _i18n.__('admin.users.actions.block'),

            yesAction () {
                UniUsers.call('blockUser', id);
            }
        });
    },

    showRemove (id) {
        const user = UniUsers.findOne(id);

        Modals.show('ask', {
            message: _i18n.__('admin.users.actions.remove', {name: user.getName()}),

            yesAction () {
                user.remove();
            }
        });
    },

    showPassword (id) {
        const user = UniUsers.findOne(id);

        Modals.show('ask', {
            message: _i18n.__('admin.users.actions.password', {name: user.getName()}),

            yesAction () {
                user.call('universe:admin-users/resetPassword', user._id);
            }
        });
    },

    showUpdate (id) {
        Modals.show('admin.users.update', {
            user: UniUsers.findOne(id)
        });
    },
    //todo Kamil ask Radek how to import files form import directory
    accountTypeIcon ({accountType = 'Other'}) {
        if (accountType === 'Instagrammer') {
            return <span><i className="fa fa-camera-retro" aria-hidden="true"></i></span>;
        }
        return <span><i className="fa fa-usd" aria-hidden="true"></i></span>;
    }
});

export default AdminView;
