export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? '#59E391' : 'white'
    }
  return (
    <div style={styles} className="die-face" onClick={props.holdDice}>
      <p className="die-number">{props.value}</p>
    </div>
  );
}
