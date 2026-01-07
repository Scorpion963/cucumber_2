"use client";
import "react-advanced-cropper/dist/style.css";
import {
  CropperRef,
  Cropper,
  FixedCropper,
  ImageRestriction,
  CircleStencil,
} from "react-advanced-cropper";

export default function FixedCircularCropper() {
  return (
    <FixedCropper
      src={
        "https://images.unsplash.com/photo-1568823561360-34f7803cf277?q=80&w=1746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      }
      stencilSize={{
        width: 500,
        height: 400,
      }}
      className="rounded-lg w-full h-112"
      stencilComponent={CircleStencil}
      stencilProps={{
        handlers: false,
        lines: false,
        movable: false,
        resizable: false,
      }}
      imageRestriction={ImageRestriction.fillArea}
    />
  );
}
