import { BookDTO } from "../dto/book.dto";
import { Book } from "../models/book.model";

export function toDto(book: Book): BookDTO {
    return {id: book.dataValues.id, title: book.dataValues.title, publishYear: book.dataValues.publishYear, author: book.dataValues.author, isbn: book.dataValues.isbn  };
}