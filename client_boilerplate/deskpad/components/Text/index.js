import b from 'b_'
import './styles.css'

module.exports = ({ children, className = '', ...props }) => <p className={`${b('Text', props)} ${className}`}>{children}</p>
