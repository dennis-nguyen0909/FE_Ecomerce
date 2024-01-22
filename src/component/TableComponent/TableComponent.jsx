import { Button, Table } from 'antd'
import React, { useMemo } from 'react'
import { useState, useEffect } from 'react';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { Excel } from 'antd-table-saveas-excel';
export const TableComponent = (props) => {
    const { isLoading = false, data: dataSource = [], columns = [], handleDeleteMany, tableRef } = props;
    const [rowSelectedKeys, setRowSelectedKeys] = useState([])
    const [forceRender, setForceRender] = useState(false);
    useEffect(() => {
        // Khi isLoading hoặc data thay đổi, cập nhật state để kích hoạt render lại component
        setForceRender(prev => !prev);
    }, [isLoading, dataSource]);
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setRowSelectedKeys(selectedRowKeys)
            // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        // getCheckboxProps: (record) => ({
        //     disabled: record.name === 'Disabled User',
        //     // Column configuration not to be checked
        //     name: record.name,
        // }),
    };
    const newComlumnExport = useMemo(() => {
        const newColumn = columns?.filter((col) => col.dataIndex !== 'action')
        return newColumn;
    }, [columns])
    const handleClick = () => {
        const excel = new Excel();
        excel
            .addSheet("test")
            .addColumns(newComlumnExport)
            .addDataSource(dataSource, {
                str2Percent: true
            })
            .saveAs("Excel.xlsx");
    };
    const [selectionType, setSelectionType] = useState('checkbox');
    const handleDeleteManyAll = () => {
        handleDeleteMany(rowSelectedKeys);
    }

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 10px' }}>
                <Button onClick={handleClick}>Export excel</Button>

            </div>
            {rowSelectedKeys.length > 0 && <div>
                <button onClick={handleDeleteManyAll} s>Xóa tất cả</button>
            </div>}
            <div>
                <LoadingComponent isLoading={isLoading}>
                    <Table

                        ref={tableRef}
                        key={forceRender} // Key được cập nhật để kích hoạt render lại component khi state thay đổi
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}
                        columns={columns}
                        dataSource={dataSource}
                        {...props}
                    />
                </LoadingComponent>
            </div>
        </>
    );
}

