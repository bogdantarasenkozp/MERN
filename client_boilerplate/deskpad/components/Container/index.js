import b from 'b_'
require('./styles.css')

module.exports = ({ className = '', contentRef, ...props }) =>
    <div className={`${b('Container')} ${className}`} ref={contentRef}>{props.children}</div>;
