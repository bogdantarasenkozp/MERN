import b from 'b_'
require('./styles.css')

module.exports = ({ col, xs, className = '', center, alignItemsCenter, right, ...props }) =>
        <div className={`${b('Col', { [col]: true, xs, center, alignItemsCenter, right })} ${className}`}>
                {props.children}
        </div>;
