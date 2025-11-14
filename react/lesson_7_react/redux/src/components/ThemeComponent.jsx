import { useSelector, useDispatch } from 'react-redux'
import { setBackgroundColor } from '../features/theme/themeSlice'
const ThemeComponent = () => {
    const backgroundColor = useSelector((state) => state.theme.backgroundColor)
    const dispatch = useDispatch()


    const handleColorChange = (event) => {
        // Dispatch action to change background color
        dispatch(setBackgroundColor(event.target.value))
    }

    return (
        <div style={{backgroundColor, padding: '20px'}}>
            Theme Component
            <input type="color" onChange={handleColorChange} value={backgroundColor} />
        </div>
    )
}

export default ThemeComponent