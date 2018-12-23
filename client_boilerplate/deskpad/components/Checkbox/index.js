import { Component } from 'react';
import Checkbox from 'react-islands/components/Checkbox';
import './styles.css';

class CheckboxForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            checked: false
        };
    }

    render() {
        const props = this.props;
        const { size, theme, name } = props;

        return (
            <Checkbox theme={theme} size={size} name={name}
                {...this.props}
                checked={this.state.checked}
                onCheck={checked => this.onCheck(checked)}
            />
        );
    }

    onCheck(checked) {
        const props = this.props;
        const { name } = props;
        const obj = { name };

        props.onCheck(checked, obj);
        this.setState({ checked });
    }
}

export default CheckboxForm;
