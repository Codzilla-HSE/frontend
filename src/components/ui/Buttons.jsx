import { Play } from 'lucide-react';

export function SubmitButton() {
  return (
    <button className="btn btn-submit" title="Отправить решение на проверку">
      Submit
    </button>
  );
}

export function RunButton() {
  return (
    <button className="btn icon-btn" title="Запустить код локально">
      <Play size={16} />
    </button>
  );
}