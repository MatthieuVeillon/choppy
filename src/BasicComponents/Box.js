import styled from "styled-components";

export const Box = styled.div`
  display: flex;
  flex-direction: ${props => (props.vertical ? "column" : "row")};
  flex-wrap: ${props => (props.wrap ? "wrap" : "nowrap")};
  justify-content: ${props => (props.center ? "center" : "flex-start")};
  align-items: ${props => (props.alignItems ? "center" : "stretch")};
  background-color: ${props => (props.debug ? "red" : props.color)};
  width: ${props => (props.width ? props.width : "auto")}
  height: ${props => (props.height ? props.height : "auto")}
`;
