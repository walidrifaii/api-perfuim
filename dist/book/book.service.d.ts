import { Repository } from 'typeorm';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
export declare class BookService {
    private readonly bookRepository;
    constructor(bookRepository: Repository<Book>);
    findAll(): Promise<Book[]>;
    create(book: CreateBookDto): Promise<Book>;
    findById(id: string): Promise<Book>;
    updateById(id: string, book: UpdateBookDto): Promise<Book>;
    deleteById(id: string): Promise<Book>;
}
