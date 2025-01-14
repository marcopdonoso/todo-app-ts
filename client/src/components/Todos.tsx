import { SearchOutlined } from '@ant-design/icons'
import type { InputRef } from 'antd'
import { Button, Card, Col, Flex, Space, Table, Tag } from 'antd'
import { type Dayjs } from 'dayjs'
import type { ColumnType, ColumnsType } from 'antd/es/table'
import type { FilterConfirmProps, Key } from 'antd/es/table/interface'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRef, useState } from 'react'
import Highlighter from 'react-highlight-words'
import { translateEngToSpaPriority } from '../helpers/translatePriorities'
import { getUniqueTagNames, uniqueArrayData } from '../helpers/uniqueArrayData'
import useTodosTable from '../hooks/useTodosTable'
import type { ITag } from '../interfaces/tags.interface'
import {
  SpaPriority,
  TaskStatus,
  type ITodo
} from '../interfaces/todo.interface'
import {
  SRowTodo,
  STableClearButton,
  STableSearchButton,
  STableSearchDiv,
  STableSearchInput,
  STableSearchOutlinedIcon
} from '../styled-components/CustomAntDesignComponents'
import { STableOrCard } from '../styled-components/STableOrCard'
import TodoModal from './TodoModal'
import ArrowDown from './icons/ArrowDown'
import ArrowRight from './icons/ArrowRight'
import ArrowUp from './icons/ArrowUp'
import NoTag from './icons/NoTag'
import TodosDeadline from './TodosDeadline'
import TodosActions from './TodosActions'
import SiteFooter from './SiteFooter'
import('dayjs/locale/es')
dayjs.locale('es')
dayjs.extend(relativeTime)

type DataIndex = keyof ITodo

const Todos: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [searchedColumn, setSearchedColumn] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [page, setPage] = useState(1)
  const {
    handleCancel,
    showModal,
    handleSubmit,
    completeTodoMsg,
    deleteMsg,
    getTags,
    open,
    confirmLoading,
    contextHolder,
    filteredTodos,
    removeTodo,
    updateCompletedStatus,
    loading,
    form,
    pageSize,
    setPageSize
  } = useTodosTable()

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: DataIndex
  ): void => {
    confirm()
    setSearchText(selectedKeys[0])
    setSearchedColumn(dataIndex)
  }

  const handleReset = (clearFilters: () => void): void => {
    clearFilters()
    setSearchText('')
  }

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<ITodo> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close
    }) => (
      <STableSearchDiv
        onKeyDown={(e) => {
          e.stopPropagation()
        }}
      >
        <STableSearchInput
          ref={searchInput}
          placeholder='Buscar tarea'
          value={selectedKeys[0]}
          onChange={(e) => {
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }}
          onPressEnter={() => {
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }}
        />
        <Space>
          <STableSearchButton
            type='primary'
            onClick={() => {
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }}
            icon={<SearchOutlined />}
            size='small'
          >
            Buscar
          </STableSearchButton>
          <STableClearButton
            onClick={() => {
              clearFilters && handleReset(clearFilters)
            }}
            size='small'
          >
            Limpiar
          </STableClearButton>
          <Button
            type='link'
            size='small'
            onClick={() => {
              confirm({ closeDropdown: false })
              setSearchText((selectedKeys as string[])[0])
              setSearchedColumn(dataIndex)
            }}
          >
            Filtrar
          </Button>
          <Button
            type='link'
            size='small'
            onClick={() => {
              close()
            }}
          >
            cerrar
          </Button>
        </Space>
      </STableSearchDiv>
    ),
    filterIcon: (filtered: boolean) => (
      <STableSearchOutlinedIcon $filtered={filtered} />
    ),
    onFilter: (value, record) => {
      const dataIndexValue = record[dataIndex]
      if (dataIndexValue !== undefined) {
        return dataIndexValue
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase())
      }
      return false
    },
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100)
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const columns: ColumnsType<ITodo> = [
    {
      title: 'Descripción de la tarea',
      dataIndex: 'title',
      ...getColumnSearchProps('title')
    },
    {
      title: 'Etiquetas',
      dataIndex: 'tags',
      width: '10%',
      filters: getUniqueTagNames(filteredTodos).map((tagName: string) => ({
        text: tagName,
        value: tagName
      })),
      onFilter: (value: boolean | Key, record: ITodo) =>
        record.tags.map((tag) => tag.tagName).includes(value as string),
      render: (record) => {
        return (
          <>
            {record.length === 0 ? (
              <NoTag />
            ) : (
              <Space size={4} wrap>
                {record.map((tag: ITag, index: number) => (
                  <Tag key={index} color={tag.tagColor}>
                    {tag.tagName}
                  </Tag>
                ))}
              </Space>
            )}
          </>
        )
      }
    },
    {
      title: 'Prioridad',
      dataIndex: 'priority',
      filters: uniqueArrayData(filteredTodos, 'priority').map((priority) => {
        return {
          text: translateEngToSpaPriority(priority as string),
          value: priority as string
        }
      }),
      onFilter: (value: boolean | Key, record) =>
        record.priority.indexOf(value.toString()) === 0,
      render: (record) => {
        return (
          <>
            {translateEngToSpaPriority(record) === SpaPriority.alta ? (
              <Flex justify='start' align='center'>
                <ArrowUp /> {translateEngToSpaPriority(record)}
              </Flex>
            ) : translateEngToSpaPriority(record) === SpaPriority.media ? (
              <Flex justify='start' align='center'>
                <ArrowRight /> {translateEngToSpaPriority(record)}
              </Flex>
            ) : (
              <Flex justify='start' align='center'>
                <ArrowDown />
                {translateEngToSpaPriority(record)}
              </Flex>
            )}
          </>
        )
      },
      width: '5%'
    },
    {
      title: 'Estado',
      dataIndex: 'completed',
      render: (record) => {
        return (
          <>{record === true ? TaskStatus.completed : TaskStatus.pending}</>
        )
      },
      width: '5%'
    },
    {
      title: 'Fecha tope',
      dataIndex: 'deadline',
      sorter: (a, b) => dayjs(a.deadline).unix() - dayjs(b.deadline).unix(),
      render: (record, row) => {
        return (
          <TodosDeadline record={record as Dayjs} completed={row.completed} />
        )
      },
      width: '10%'
    },
    {
      title: 'Vencimiento',
      render: (_, row) => {
        return (
          <>
            {row.completed ? (
              <span>N/A</span>
            ) : (
              dayjs(new Date()).to(row.deadline)
            )}
          </>
        )
      },
      width: '8%'
    },
    {
      title: 'Acciones',
      render: (record, row) => {
        return (
          <TodosActions
            row={row}
            record={record}
            updateCompletedStatus={updateCompletedStatus}
            completeTodoMsg={completeTodoMsg}
            showModal={showModal}
            getTags={getTags}
            removeTodo={removeTodo}
            deleteMsg={deleteMsg}
          />
        )
      },
      width: '10%'
    }
  ]

  return (
    <STableOrCard>
      <div className='todos-table'>
        {contextHolder}
        <SRowTodo justify='center'>
          <Col span={20}>
            <Table
              columns={columns}
              dataSource={filteredTodos}
              rowKey={(record) => record._id ?? ''}
              rowClassName={(record) => {
                if (record.completed) {
                  return 'completed-table-cell'
                }
                return ''
              }}
              pagination={{
                showSizeChanger: true,
                current: page,
                pageSize,
                onChange: (page, pageSize) => {
                  setPage(page)
                  setPageSize(pageSize)
                }
              }}
              loading={loading}
            />
          </Col>
        </SRowTodo>
        <TodoModal
          open={open}
          onCancel={handleCancel}
          onOk={form.submit}
          onFinish={handleSubmit}
          name='editTodo'
          modalTitle='Editar tarea'
          form={form}
          confirmLoading={confirmLoading}
        />
      </div>

      {/* TASKS CARDS FOR SMALL SCREENS */}
      <div className='todos-cards'>
        {filteredTodos.map((todo: ITodo) => (
          <Card
            className={todo.completed ? 'task-card-completed' : 'task-card'}
            key={todo._id}
            title={todo.title}
            headStyle={
              todo.completed
                ? { color: '#989898' }
                : {
                    color: ''
                  }
            }
          >
            <div className='task-details'>
              <div className='task-status'>
                {todo.completed ? 'Completado' : 'Pendiente'}
              </div>

              <div className='task-deadline'>
                <TodosDeadline
                  record={todo.deadline as Dayjs}
                  completed={todo.completed}
                />
              </div>

              <div className='task-actions'>
                <TodosActions
                  row={todo}
                  record={todo}
                  updateCompletedStatus={updateCompletedStatus}
                  completeTodoMsg={completeTodoMsg}
                  showModal={showModal}
                  getTags={getTags}
                  removeTodo={removeTodo}
                  deleteMsg={deleteMsg}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <SiteFooter />
    </STableOrCard>
  )
}

export default Todos
