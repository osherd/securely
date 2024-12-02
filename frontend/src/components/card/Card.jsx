import styles from './Card.module.scss';
// eslint-disable-next-line react/prop-types
const Card = ({ children, cardClass }) => {
  return <div className={`${styles.card} ${cardClass}`}>{children}</div>;
};

export default Card;
