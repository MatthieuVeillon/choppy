import styled from 'styled-components';

export const Form = styled.form`
    width=100%;
    padding:${props => (props.padding ? props.padding : '0px')};
    display: flex;
    flex-direction: ${props => (props.horizontal ? 'row' : 'column')};
    justify-content: space-between;
    align-items: ${props => (props.stretch ? props.stretch : 'flex-start')};
`;
