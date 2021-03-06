import {UniUI} from '{universe:ui-react-forms}';
import {DualLinkMixin} from '{universe:utilities-react}';
import {Actions, Button, Content, Modal, Modals} from '{universe:ui-react}';

export const UpdateModal = React.createClass({
    displayName: 'Admin.users.Update',

    mixins: [DualLinkMixin],

    propTypes: {
        user: React.PropTypes.object,
        modal: React.PropTypes.object.isRequired,
        visible: React.PropTypes.bool.isRequired
    },

    componentWillMount () {
        this.dualLink().setRemote(this.props.user);
    },

    componentWillReceiveProps (props) {
        this.dualLink().clear();
        this.dualLink().setRemote(props.user);
    },

    render () {
        let user = this.props.user;

        if (!user) {
            // empty modal for fade out
            return (
                <Modal className="small basic"
                       visible={this.props.visible}
                       modal={{
                           onHide: this.props.modal.onHide,
                           selector: {
                               close: '.actions .close'
                           }
                       }}
                />
            );
        }

        return (
            <Modal className="small basic"
                   visible={this.props.visible}
                   modal={{
                       onHide: this.props.modal.onHide,
                       selector: {
                           close: '.actions .close'
                       }
                   }}
            >
                <Content ref="content">
                    {UniUI.render(this.dualLink(), (user, done) => {
                        UniUsers.update(this.dualLink().get('_id'), {$set: user}, (error) => {
                            done(error);

                            if (!error) {
                                Modals.hide('admin.users.update');
                            }
                        });
                    }, 'edit')}
                </Content>

                <Actions>
                    <Button className="basic inverted close">
                        <i className="remove icon"></i>
                        {i18n('common.close')}
                    </Button>

                    <Button className="basic inverted red" onClick={this.reset}>
                        <i className="ban icon"></i>
                        {i18n('common.reset')}
                    </Button>

                    <Button className="basic inverted green" onClick={this.submit}>
                        <i className="checkmark icon"></i>
                        {i18n('common.save')}
                    </Button>
                </Actions>
            </Modal>
        );
    },

    reset () {
        this.dualLink().clear();
        $('.ui.form', ReactDOM.findDOMNode(this.refs.content)).form('reset').form('add errors', []);
    },

    submit () {
        $('.ui.form', ReactDOM.findDOMNode(this.refs.content)).form('submit');
    }
});

export default UpdateModal;

Modals.register({
    name: 'admin.users.update',
    component: UpdateModal
});
