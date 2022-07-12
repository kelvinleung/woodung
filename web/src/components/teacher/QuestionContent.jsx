const QuestionContent = ({
  question,
  onDescriptionChange,
  onOptionsChange,
  onSetAnswer,
}) => {
  const options = question.options;

  const changeOptions = (val, id) => {
    onOptionsChange(val, id);
    // 清除正确答案
    if (!val && question.answerId === id) {
      onSetAnswer(-1);
    }
  };

  const setAnswer = (id) => {
    onSetAnswer(id);
  };

  return (
    <section className="p-8 flex flex-col flex-grow text-lg">
      <div className="mb-8 flex items-center flex-grow bg-white rounded-xl">
        <input
          className="p-8 flex-grow text-center text-3xl outline-none bg-transparent"
          type="text"
          placeholder="请输入问题"
          value={question.description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>
      <ul className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <li
            className={[
              "p-4 flex items-center rounded-md",
              `border-l-4 border-[${option.color}]`,
              option.text ? `bg-[${option.color}]` : "bg-white",
            ].join(" ")}
            key={option.id}
          >
            <input
              className={[
                "p-8 flex-grow outline-none bg-transparent",
                option.text ? "text-white" : "",
              ].join(" ")}
              type="text"
              placeholder="请输入答案"
              value={option.text}
              onChange={(e) => changeOptions(e.target.value, option.id)}
            />
            {option.text && (
              <button
                className={[
                  "w-8 h-8 border-2 border-white rounded-full hover:bg-green-600",
                  question.answerId === option.id ? "bg-green-600" : "",
                ].join(" ")}
                onClick={() => setAnswer(option.id)}
              ></button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default QuestionContent;
