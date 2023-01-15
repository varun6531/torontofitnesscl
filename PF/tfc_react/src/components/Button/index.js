import "./style.css"

const Button = ({value, update}) => {
    // if is operator then orange background, if not then light gray
    return <button
        onClick={() => update(value)}
    >
        {value}
    </button>
}

export default Button;