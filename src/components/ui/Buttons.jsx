import playIcon from '../../assets/play-icon.svg';

export function SubmitButton() {
  return (
    <button className="btn btn-submit" title="Отправить решение">
      Submit
    </button>
  );
}

export function RunButton() {
  return (
    <button className="btn btn-run" title="Запустить код">
      <img src={playIcon} alt="Run" />
    </button>
  );
}