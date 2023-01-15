import React from 'react';

class Input extends React.Component {

    render(){
        const {title, update, value} = this.props
        return <>
            <span style={{marginLeft: '27%'}}>{title}</span>
            <input type="text"
                   value={value}
                   onChange={event => update(event.target.value)}
                   style={{width:200, height:20, fontSize: '1em', backgroundColor: "lightcyan"}}
            />
        </>
    }
}

export default Input;