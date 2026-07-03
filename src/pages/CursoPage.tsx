const CursoPage = () => {
  return (
    <div style={{ width: "100%", height: "calc(100vh - 64px)", overflow: "hidden" }}>
      <iframe
        src="/curso1.html"
        title="Curso Infográfico"
        style={{ width: "100%", height: "100%", border: "none" }}
      />
    </div>
  );
};

export default CursoPage;
