import React from 'react';
import {shallow} from "enzyme";
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import {RecipeHomeCard} from "./RecipeHomeCard";
import recipeThumbnail1 from '../img/recipeThumbnail1.jpg'
import recipeThumbnail2 from '../img/recipeThumbnail2.jpg'
import recipeThumbnail3 from '../img/recipeThumbnail3.jpg'

Enzyme.configure({ adapter: new Adapter() });

describe('RecipeHomeCard component test', () => {

    const recipes = [    {
        id: 0,
        title : 'Pizza au champignon',
        img: "recipeThumbnail1"
    }, {
        id: 1,
        title : 'Pizza au tomate',
        img: "recipeThumbnail2"
    },
        {
            id: 2,
            title : 'Pizza au fromage',
            img: "recipeThumbnail3"
        }];

    it ('should render with the right props', () => {
        const component = shallow(<RecipeHomeCard {...recipes}/>);
    })
})