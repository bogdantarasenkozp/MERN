import App from 'deskpad/components/App'
import Home from 'deskpad/routes/home'
import Login from 'deskpad/routes/login'
import Registration from 'deskpad/routes/registration'
import Reset from 'deskpad/routes/reset'
import Restore from 'deskpad/routes/restore'

module.exports = {
    path: '/',
    component: App,
    indexRoute: Home,
    childRoutes: [
        Login,
        Reset,
        Registration,
        Restore
    ]
}
