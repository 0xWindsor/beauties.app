import { useEffect, useRef } from "react";
import { CgFileDocument, CgPullClear } from "react-icons/cg";

export default function Canvas(props) {
  const canvasEl = useRef(null);
  var canvas;

  useEffect(() => {
    canvas = new fabric.Canvas(canvasEl.current);

    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush.width = 25;
    canvas.freeDrawingBrush.color = "#FF0000";

    var imgObj = new Image();
    imgObj.src = props.image;
    imgObj.onload = function () {
      var image = new fabric.Image(imgObj);
      image.set({
        angle: 0,
        padding: 10,
        cornersize: 10,
      });
      image.scaleToHeight(480);
      image.scaleToWidth(480);
      canvas.centerObject(image);
      canvas.setBackgroundImage(image);
    };

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    props.submit();
  }, [props.uimage]);

  async function handle() {
    canvas.getObjects().map((obj) => {
      obj.set({
        stroke: "#000000",
      });
    });
    const bgImage = canvas.backgroundImage;
    canvas.backgroundImage = null;
    const maskDataURL = canvas.toDataURL();
    props.setMask(maskDataURL);

    canvas.getObjects().map((obj) => {
      obj.set({
        stroke: null,
      });
    });
    canvas.backgroundImage = bgImage;
    const imageDataURL = canvas.toDataURL();
    props.setImage(imageDataURL);

    canvas.getObjects().map((obj) => {
      obj.set({
        stroke: "#FF0000",
      });
    });
  }

  function handleImport() {
    return (
      <div>
        {/* CANVAS */}
        <div className="bg-white rounded-lg my-8 flex items-center justify-center">
          <canvas
            width={480}
            height={480}
            ref={canvasEl}
            onChange={props.onChange}
          />
        </div>

        {/* NEW & CLEAR BUTTON */}
        <div className="flex items-center gap-4 py-4">
          {/* CLEAR BUTTON */}
          <button
            onClick={clearAll}
            className="flex items-center gap-4 text-black w-full bg-white py-4 rounded-lg justify-center"
          >
            <CgPullClear className="text-2xl" />
            Clear
          </button>

          {/* NEW BUTTON */}
          <button
            onClick={handle}
            className="flex items-center gap-4 text-black w-full bg-white py-4 rounded-lg justify-center"
          >
            <CgFileDocument className="text-2xl" />
            Submit
          </button>
        </div>
      </div>
    );
  }

  function clearAll() {}

  return <>{props.image ? handleImport() : null}</>;
}
