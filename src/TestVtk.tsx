
import { useState, useRef, useEffect } from 'react';

import '@kitware/vtk.js/Rendering/Profiles/Geometry';

import vtkFullScreenRenderWindow from '@kitware/vtk.js/Rendering/Misc/FullScreenRenderWindow';

import vtkActor           from '@kitware/vtk.js/Rendering/Core/Actor';
import vtkMapper          from '@kitware/vtk.js/Rendering/Core/Mapper';
import vtkConeSource      from '@kitware/vtk.js/Filters/Sources/ConeSource';
import vtkRenderer from "@kitware/vtk.js/Rendering/Core/Renderer";
import vtkRenderWindow from "@kitware/vtk.js/Rendering/Core/RenderWindow";

interface IVTKContext {
    fullScreenRenderer?: vtkFullScreenRenderWindow;
    renderWindow?: vtkRenderWindow;
    renderer?: vtkRenderer;
    coneSource?: vtkConeSource;
    actor?: vtkActor;
    mapper?: vtkMapper;
  }

function TestVtk() {
  const vtkContainerRef = useRef<HTMLDivElement | null>(null);
  const context = useRef<IVTKContext | null>(null);
  const [coneResolution, setConeResolution] = useState(6);
  const [representation, setRepresentation] = useState(2);

  useEffect(() => {
    if (!context.current) {
      const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance({
        container: vtkContainerRef.current ?? undefined,
      });
      const coneSource = vtkConeSource.newInstance({ height: 1.0 });

      const mapper = vtkMapper.newInstance();
      mapper.setInputConnection(coneSource.getOutputPort());

      const actor = vtkActor.newInstance();
      actor.setMapper(mapper);

      const renderer = fullScreenRenderer.getRenderer();
      const renderWindow = fullScreenRenderer.getRenderWindow();

      renderer.addActor(actor);
      renderer.resetCamera();
      renderWindow.render();

      context.current = {
        fullScreenRenderer,
        renderWindow,
        renderer,
        coneSource,
        actor,
        mapper,
      };
    }

    //return () => {
    //  if (context.current) {
    //    const { fullScreenRenderer, coneSource, actor, mapper } = context.current;
    //    actor?.delete();
    //    mapper?.delete();
    //    coneSource?.delete();
    //    fullScreenRenderer?.delete();
    //    context.current = null;
    //  }
    //};
  }, [vtkContainerRef]);

  useEffect(() => {
    if (context.current) {
      const { coneSource, renderWindow } = context.current;
      coneSource?.setResolution(coneResolution);
      renderWindow?.render();
    }
  }, [coneResolution]);

  useEffect(() => {
    if (context.current) {
      const { actor, renderWindow } = context.current;
      actor?.getProperty().setRepresentation(representation);
      renderWindow?.render();
    }
  }, [representation]);

  return (
    <div>
      <div ref={vtkContainerRef} />
      <table
        style={{
          position: 'absolute',
          top: '25px',
          left: '25px',
          background: 'white',
          padding: '12px',
        }}
      >
        <tbody>
          <tr>
            <td>
              <select
                value={representation}
                style={{ width: '100%' }}
                onInput={(ev) => setRepresentation(Number(ev.currentTarget.value))}
              >
                <option value="0">Points</option>
                <option value="1">Wireframe</option>
                <option value="2">Surface</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>
              <input
                type="range"
                min="4"
                max="80"
                value={coneResolution}
                onChange={(ev) => setConeResolution(Number(ev.currentTarget.value))}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default TestVtk;