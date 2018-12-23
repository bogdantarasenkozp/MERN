import b from 'b_'
import './styles.css'

module.exports = ({ children, ...props }) => <div className={b('Form', 'error', props)}>{children}</div>
