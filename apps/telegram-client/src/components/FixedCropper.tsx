"use client";
import "react-advanced-cropper/dist/style.css";
import {
  CropperRef,
  Cropper,
  FixedCropper,
  ImageRestriction,
  CircleStencil,
} from "react-advanced-cropper";

const horizontal =
  "https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?cs=srgb&dl=pexels-christian-heitz-285904-842711.jpg&fm=jpg";
const vertical =
  "https://plus.unsplash.com/premium_photo-1669741909456-61b8b9b3f329?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1564754943164-e83c08469116?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function FixedCircularCropper() {
  return (
    <FixedCropper
      src={horizontal}
      stencilSize={{
        width: 350,
        height: 350,
      }}
      style={{ width: 350, height: 350 }}
      className="rounded-lg"
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
