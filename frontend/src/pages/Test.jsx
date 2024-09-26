import AddData from "../components/AddData";
import * as React from "react";

function Test() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSave = (data) => {
    alert(`Saved data: ${JSON.stringify(data)}`);
    setModalOpen(false);
  };
  return (
    <>
      <button onClick={() => setModalOpen(true)}>Open Modal</button>
      <AddData
        open={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />
    </>
  );
}

export default Test;
