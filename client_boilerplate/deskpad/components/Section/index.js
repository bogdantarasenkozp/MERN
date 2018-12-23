import b from 'b_'

import './styles.css'

module.exports = ({ theme = 'white', size, name, className = '', ...props }) =>
    <div className={`${b('Section', { theme, size, name })} ${className}`}>{props.children}</div>
