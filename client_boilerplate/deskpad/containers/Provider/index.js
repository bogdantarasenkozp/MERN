import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import pageActions from 'deskpad/actions/page'
import pick from 'lodash/pick'

import Spin from 'deskpad/components/Spin'

const Provider = (fields = []) => BaseComponent => {
    class ComponentContainer extends BaseComponent {
        componentWillMount() {
            const props = this.props

            this.props.pageActions.load(props.type)

            this.setState({
                isLoading: true
            })
        }

        componentWillReceiveProps(nextProps) {
            this.setState({
                isLoading: nextProps.page.isLoading
            })
        }

        render() {
            const state = this.state

            return state.isLoading ? <Spin size='m' theme='default' className='spin_fixed' /> : super.render()
        }
    }

    return connect(
        state => pick(state, [ 'page', 'config', ...fields ]),
        dispatch => ({
            pageActions: bindActionCreators(pageActions, dispatch)
        })
    )(ComponentContainer)
}

module.exports = Provider
