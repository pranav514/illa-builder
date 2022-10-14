import { FC, memo, useCallback, useMemo } from "react"
import { Header } from "./header"
import { ViewItemShape, ViewSetterProps } from "./interface"
import { generateNewViewItem } from "./utils/generateNewOptions"
import { ListBody } from "./listBody"
import { ViewListSetterProvider } from "./context/viewsListContext"
import { get } from "lodash"
import { useSelector } from "react-redux"
import { getExecutionResult } from "@/redux/currentApp/executionTree/executionSelector"
import {
  setterPublicWrapper,
  viewSetterWrapperStyle,
} from "@/page/App/components/PanelSetters/ContainerSetter/ViewsSetter/style"

export const TabsSetter: FC<ViewSetterProps> = memo(
  (props: ViewSetterProps) => {
    const {
      value,
      handleUpdateDsl,
      attrName,
      widgetDisplayName,
      childrenSetter,
      handleUpdateMultiAttrDSL,
    } = props
    const executionResult = useSelector(getExecutionResult)

    const allViews = useMemo(() => {
      return get(
        executionResult,
        `${widgetDisplayName}.${attrName}`,
        [],
      ) as ViewItemShape[]
    }, [attrName, executionResult, widgetDisplayName])

    const allViewsKeys = useMemo(() => {
      return allViews.map((view) => view.key)
    }, [allViews])

    const viewComponentsArray = useMemo(() => {
      return get(executionResult, `${widgetDisplayName}.viewComponentsArray`, [
        [],
      ])
    }, [executionResult, widgetDisplayName])

    const handleAddViewItem = useCallback(() => {
      const newItem = generateNewViewItem(allViewsKeys)
      handleUpdateMultiAttrDSL?.({
        [attrName]: [...value, newItem],
        viewComponentsArray: [...viewComponentsArray, []],
      })
    }, [
      allViewsKeys,
      handleUpdateMultiAttrDSL,
      attrName,
      value,
      viewComponentsArray,
    ])

    return (
      <ViewListSetterProvider
        viewsList={value}
        childrenSetter={childrenSetter || []}
        handleUpdateDsl={handleUpdateDsl}
        widgetDisplayName={widgetDisplayName}
        attrPath={attrName}
        handleUpdateMultiAttrDSL={handleUpdateMultiAttrDSL}
      >
        <div css={setterPublicWrapper}>
          <div css={viewSetterWrapperStyle}>
            <Header
              labelName="view"
              addAction={handleAddViewItem}
              hasAddAction
            />
            <ListBody />
          </div>
        </div>
      </ViewListSetterProvider>
    )
  },
)

TabsSetter.displayName = "TabsSetter"
