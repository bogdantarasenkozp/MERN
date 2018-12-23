import b from 'b_'

import './styles.css'

module.exports = ({ className = '', onClick, ...props }) => {
    const handleClick = e => {
        if (typeof onClick === 'function') {
            onClick(e, props)
        }

        return false
    }

    return <div className={`${b('Row')} ${className}`} onClick={handleClick}>{props.children}</div>
}
