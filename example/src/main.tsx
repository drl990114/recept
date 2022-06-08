import {
  h,
  render,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from '../../src'
import EffectDemo from "./components/useEffect"
// import React, { useEffect, useState,useMemo,useRef ,useCallback} from 'react'
// import { render } from 'react-dom'


export {
  h,
  render,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
}
render(<EffectDemo key="root" />, document.getElementById('root')!)
