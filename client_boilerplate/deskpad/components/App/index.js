import { Component } from 'react'
import Sprite from 'deskpad/components/Sprite'
import './styles.css'

class App extends Component {
    render() {
        return (
            <div className='app_wrapper'>
                {this.props.children}
                <Sprite />
            </div>
        );
    }
}

module.exports = App;
