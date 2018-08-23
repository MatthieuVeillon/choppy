import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "material-ui/styles";
import { Card, Icon, CardContent, CardMedia } from "material-ui";
import Typography from "material-ui/Typography";
import { compose, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

const styles = {
  card: {
    width: 180,
    marginBottom: "20px"
  },
  media: {
    height: 130
  },
  cardContent: {
    height: 80,
    padding: "10px"
  },
  cardTitle: {
    marginTop: "-10px",
    fontSize: "16px"
  }
};

const recipeCard = ({
  classes,
  title,
  uploadImageUrl,
  recipeId,
  canBeFrozen,
  cookingTime,
  pricePerPortion,
  navigateTo
}) => {
  return (
    <div onClick={navigateTo}>
      <Card className={classes.card}>
        <CardMedia className={classes.media} image={uploadImageUrl} title="Contemplative Reptile" />
        <CardContent className={classes.cardContent}>
          <Typography className={classes.cardTitle} variant="subheading" component="h2">
            {title}
          </Typography>
          {canBeFrozen && (
            <FlexContainer>
              <Icon style={{ fontSize: 14 }}>ac_unit</Icon>
              <Typography style={{ fontSize: 12 }}>can be frozen</Typography>
            </FlexContainer>
          )}

          {cookingTime && (
            <FlexContainer>
              <Icon style={{ fontSize: 14 }}>timer</Icon>
              <Typography style={{ fontSize: 12 }}>{cookingTime} min</Typography>
            </FlexContainer>
          )}

          {pricePerPortion && (
            <FlexContainer>
              <Icon style={{ fontSize: 14 }}> attach_money</Icon>
              <Typography style={{ fontSize: 12 }}>{pricePerPortion} / each</Typography>
            </FlexContainer>
          )}
        </CardContent>
        {/*<CardActions>*/}
        {/*<Button size="small" color="primary">*/}
        {/*<Link to={`/recipe/${recipeId}`}>Learn More</Link>*/}
        {/*</Button>*/}
        {/*</CardActions>*/}
      </Card>
    </div>
  );
};

recipeCard.propTypes = {
  classes: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export const RecipeCard = compose(
  withRouter,
  withHandlers({
    navigateTo: ({ history, recipeId }) => () => history.push(`/recipe/${recipeId}`)
  }),
  withStyles(styles)
)(recipeCard);

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
