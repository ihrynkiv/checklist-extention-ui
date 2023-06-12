import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { whoAmIAction } from '../store/auth/auth.slice';
import { useHistory } from 'react-router-dom';
import { IconButton, List, ListItem, ListItemText } from '@mui/material';
import { NoItems } from './NoItems';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteReview, fetchReviews } from '../store/reviews/reviews.slice';
import { selectReviews } from '../store/reviews/review.selector';

const STYLES = {
  btn: {margin: '0 1px'},
  form: {display: 'flex', height: '45px', marginBottom: '7px'},
  textField: {  margin: '0 0 0 5px' },
  addBtn: { margin: '0 8px' },
}

export const ReviewsList = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(whoAmIAction()).then((action) => {
      if(action?.payload?.response?.status === 401 || action.error) {
        history.push('/login')
      }
    })
  }, [dispatch, history])

  useEffect(() => {
   dispatch(fetchReviews())
  }, [dispatch]);

  const reviews = useSelector(selectReviews)

  const handleDelete = (prId) => {
    dispatch(deleteReview(prId))
    dispatch(fetchReviews())
  }

  return (
    <>
    <List style={{overflow: 'scroll', height: '450px'}}>
      {
        reviews.length ? reviews.map(({prId}) => {
          return (
            <ListItem
              key={prId}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="Delete"
                  style={STYLES.btn}
                  title="Видалити"
                  color={"secondary"}
                  onClick={() => handleDelete(prId)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <a href={prId} target="_blank" rel="noopener noreferrer">
                <ListItemText primary={prId} />
              </a>
            </ListItem>
          )
        }) : <NoItems/>
      }
    </List>
  </>
  )
}
