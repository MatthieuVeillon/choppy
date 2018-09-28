import styled from "styled-components";

export const Box = styled.div`
    display: flex;
    flex-direction: ${props => (props.vertical ? "column" : "row")};
    flex-wrap: ${props => (props.wrap ? "wrap" : "nowrap")};
    justify-content: ${props =>
      props.center ? "center" : props.spaceAround ? "space-around" : props.spaceBetween ? "space-between" : "flex-start"};
    align-items: ${props => (props.alignItems ? "center" : "stretch")};
    align-self: ${props => (props.alignSelf ? props.alignSelf : "auto")};
    background-color: ${props => (props.debug ? "red" : props.color)};
    width: ${props => (props.width ? props.width : "auto")}
    height: ${props => (props.height ? props.height : "auto")}
    border: ${props => (props.border || props.debug ? "1px solid black" : "none")}
    margin: ${props => (props.margin && !props.bottom && !props.top ? props.margin : 0)}
    margin-top: ${props => (props.top ? props.top : 0)}
    margin-bottom: ${props => (props.bottom ? props.bottom : 0)}
    box-shadow: ${props => (props.shadow ? "2px 2px 2px grey" : 0)} 
`;

export const FormField = styled.input`
    -webkit-appearance: ${props => (props.type === "checkbox" ? props.type : "none")};
    width: ${props => (props.width ? props.width : "auto")}
    height: ${props => (props.height ? props.height : "auto")}
    flex-grow: ${props => (props.grow ? props.grow : 0)};
    align-self: ${props => (props.alignSelf ? props.alignSelf : "auto")};
    margin-top: ${props => (props.top ? props.top : 0)}
    margin-bottom: ${props => (props.bottom ? props.bottom : 0)}
    margin-left: ${props => (props.left ? props.left : 0)}
    margin-right: ${props => (props.right ? props.right : 0)} 
    padding: 12px 5px;
    border: 1px solid #ccc;
    border-radius: 0;
    box-sizing:border-box;
`;

export const TextArea = styled.textarea`
    -webkit-appearance: none;
    width:100%
    padding: 12px 5px;
    margin-top: ${props => (props.top ? props.top : 0)}
    margin-bottom: ${props => (props.bottom ? props.bottom : 0)}
    margin-left: ${props => (props.left ? props.left : 0)}
    margin-right: ${props => (props.right ? props.right : 0)} 
    border: 1px solid #ccc;
    border-radius: 0;
`;

export const Button = styled.button`
    font-size: ${props => (props.fontSize ? props.fontSize : "17px")}
    text-transform: uppercase;
    width: ${props => (props.width ? props.width : "auto")}
    height: ${props => (props.height ? props.height : "auto")}
    background-color: ${props => (props.primary ? "#4caf50" : "white")}
    color: ${props => (props.primary ? "white" : "#4caf50")}
     margin-top: ${props => (props.top ? props.top : 0)}
    border: 2px solid #4caf50;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
`;

export const Select = styled.select`
  border-radius: 0;
`;
