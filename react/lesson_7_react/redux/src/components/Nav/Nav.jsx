import { useSelector } from 'react-redux'

const Nav = () => {
    const backgroundColor = useSelector((state) => state.theme.backgroundColor)

    return (
        <nav style={{backgroundColor, padding: '10px'}}>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    )
}
export default Nav;