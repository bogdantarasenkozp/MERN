import Sprite from '!svg-inline-loader!./Sprite.svg'
import './styles.css'

module.exports = () => <div dangerouslySetInnerHTML={{ __html: Sprite }} />
