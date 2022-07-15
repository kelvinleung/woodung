const QuestionList = ({
  questions,
  onAddQuestion,
  onSelectQuestion,
  onRemoveQuestion,
  activeId,
}) => {
  // 给数据添加 id 字段
  const questionData = questions.map((q, id) => ({ ...q, id }));
  return (
    <aside className="w-[260px] pb-4 overflow-auto bg-white">
      <div className="p-4 text-center text-sm">{`共 ${questionData.length} 道题目`}</div>
      <ul className="mb-8">
        {questionData.map((question) => (
          <li
            className={[
              "p-4 flex items-center",
              activeId === question.id ? "bg-sky-50" : "",
            ].join(" ")}
            key={question.id}
          >
            <div
              className={[
                "px-4 py-12 mr-4 flex-grow text-sm text-center rounded-lg cursor-pointer",
                activeId === question.id ? "bg-white" : "bg-slate-100",
              ].join(" ")}
              onClick={() => {
                onSelectQuestion(question.id);
              }}
            >
              {question.description || "新题目"}
            </div>
            <button
              disabled={questions.length <= 1}
              onClick={() => onRemoveQuestion(question.id)}
            >
              删除
            </button>
          </li>
        ))}
      </ul>
      <div className="px-4">
        <button
          className="p-4 w-full block bg-sky-500 text-white text-sm rounded-md"
          onClick={onAddQuestion}
        >
          添加问题
        </button>
      </div>
    </aside>
  );
};

export default QuestionList;
